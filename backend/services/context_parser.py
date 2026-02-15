import json
import os
import re
from typing import Optional

import requests
from dotenv import load_dotenv

load_dotenv()


def _parse_repo_from_url(url: str) -> Optional[tuple[str, str]]:
    match = re.search(r"github.com/([^/]+)/([^/#]+)", url)
    if not match:
        return None
    owner = match.group(1)
    repo = match.group(2).replace(".git", "")
    return owner, repo


def _fetch_readme_raw(owner: str, repo: str, branch: str) -> Optional[str]:
    headers = {}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/README.md"
    response = requests.get(raw_url, headers=headers, timeout=10)
    if response.ok:
        return response.text
    return None


def fetch_readme_from_github(url: str) -> Optional[str]:
    parsed = _parse_repo_from_url(url)
    if not parsed:
        return None
    owner, repo = parsed

    for branch in ["main", "master", "develop"]:
        content = _fetch_readme_raw(owner, repo, branch)
        if content:
            return content

    api_url = f"https://api.github.com/repos/{owner}/{repo}/readme"
    headers = {"Accept": "application/vnd.github.v3+json"}
    token = os.getenv("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    response = requests.get(api_url, headers=headers, timeout=10)
    if response.ok:
        payload = response.json()
        if "content" in payload:
            try:
                import base64

                return base64.b64decode(payload["content"]).decode("utf-8")
            except Exception:
                return None
    return None


def _basic_context(readme_text: str) -> dict:
    lines = [line.strip() for line in readme_text.splitlines() if line.strip()]
    title = lines[0].lstrip("# ") if lines else "Untitled Project"
    summary = " ".join(lines[1:4]) if len(lines) > 1 else "No summary available yet."
    return {
        "product_name": title,
        "summary": summary,
        "audience": "Growth leaders, founders, and product teams",
        "value_props": ["Faster launch execution", "Clearer messaging", "Operational visibility"],
        "tone": "Confident and launch-ready",
        "channels": ["Website", "Email", "Social", "Community"],
        "constraints": ["Lean team", "Limited launch window"],
        "source": "heuristic",
    }


def _llm_context(readme_text: str) -> Optional[dict]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        from openai import OpenAI
    except Exception:
        return None

    client = OpenAI(api_key=api_key)
    prompt = (
        "Extract structured product launch context from the README below. "
        "Return strict JSON with keys: product_name, summary, audience, value_props, "
        "tone, channels, constraints. value_props, channels, constraints should be arrays of strings."
    )

    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": readme_text},
        ],
        temperature=0.2,
    )
    content = response.choices[0].message.content or ""
    try:
        payload = json.loads(content)
    except json.JSONDecodeError:
        return None

    payload["source"] = "llm"
    return payload


def _normalize_list(value: Optional[object]) -> list[str]:
    if isinstance(value, list):
        return [str(item) for item in value if str(item).strip()]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []


def _normalize_context(payload: dict, fallback_text: str) -> dict:
    fallback = _basic_context(fallback_text)
    return {
        "product_name": payload.get("product_name") or fallback["product_name"],
        "summary": payload.get("summary") or fallback["summary"],
        "audience": payload.get("audience") or fallback["audience"],
        "value_props": _normalize_list(payload.get("value_props")) or fallback["value_props"],
        "tone": payload.get("tone") or fallback["tone"],
        "channels": _normalize_list(payload.get("channels")) or fallback["channels"],
        "constraints": _normalize_list(payload.get("constraints")) or fallback["constraints"],
        "source": payload.get("source") or fallback["source"],
    }


def parse_project_context(github_url: Optional[str], readme_text: Optional[str]) -> dict:
    text = readme_text
    if not text and github_url:
        text = fetch_readme_from_github(github_url)

    if not text:
        return _basic_context("Untitled Project")

    llm_payload = _llm_context(text)
    if llm_payload:
        return _normalize_context(llm_payload, text)

    return _basic_context(text)
