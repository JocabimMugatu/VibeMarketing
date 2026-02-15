"""
Browser Agent Service for VibeLaunch OS

This module provides hooks for browser automation using Playwright.
It's designed to be extended with actual browser-use or Playwright integration.
"""

import os
from typing import Optional, Dict, Any, List
from datetime import datetime


class BrowserAgentLog:
    """Represents a browser agent activity log."""
    
    def __init__(self, action: str, detail: str, url: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None):
        self.id = f"browser-{datetime.utcnow().timestamp()}"
        self.timestamp = datetime.utcnow().isoformat() + "Z"
        self.action = action
        self.detail = detail
        self.url = url
        self.metadata = metadata or {}
        self.status = "pending"
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "action": self.action,
            "detail": self.detail,
            "url": self.url,
            "metadata": self.metadata,
            "status": self.status
        }


class BrowserAgent:
    """
    Browser Agent for automating web interactions.
    
    This is a scaffold that can be extended with:
    - Playwright for browser automation
    - browser-use for AI-driven browsing
    - Custom scraping logic
    """
    
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.session_logs: List[BrowserAgentLog] = []
        self._playwright = None
        self._browser = None
        
    async def initialize(self):
        """Initialize the browser instance."""
        try:
            from playwright.async_api import async_playwright
            
            self._playwright = await async_playwright().start()
            self._browser = await self._playwright.chromium.launch(headless=self.headless)
            
            log = BrowserAgentLog("init", "Browser agent initialized", metadata={"headless": self.headless})
            log.status = "success"
            self.session_logs.append(log)
            
            return True
        except ImportError:
            log = BrowserAgentLog("init", "Playwright not installed", metadata={"headless": self.headless})
            log.status = "error"
            self.session_logs.append(log)
            return False
        except Exception as e:
            log = BrowserAgentLog("init", f"Failed to initialize: {str(e)}")
            log.status = "error"
            self.session_logs.append(log)
            return False
    
    async def navigate(self, url: str) -> BrowserAgentLog:
        """Navigate to a URL."""
        log = BrowserAgentLog("navigate", f"Navigating to {url}", url=url)
        
        if not self._browser:
            log.status = "error"
            log.detail += " - Browser not initialized"
            self.session_logs.append(log)
            return log
        
        try:
            page = await self._browser.new_page()
            await page.goto(url, wait_until="networkidle")
            log.status = "success"
            log.metadata["title"] = await page.title()
            await page.close()
        except Exception as e:
            log.status = "error"
            log.detail += f" - {str(e)}"
        
        self.session_logs.append(log)
        return log
    
    async def scrape_readme(self, github_url: str) -> BrowserAgentLog:
        """Scrape README from a GitHub repository page."""
        log = BrowserAgentLog("scrape", f"Scraping README from {github_url}", url=github_url)
        
        try:
            # For now, delegate to the context parser's fetch function
            from services.context_parser import fetch_readme_from_github
            
            content = fetch_readme_from_github(github_url)
            
            if content:
                log.status = "success"
                log.metadata["content_length"] = len(content)
                log.detail = f"Successfully fetched README ({len(content)} chars)"
            else:
                log.status = "warning"
                log.detail = "Could not fetch README content"
                
        except Exception as e:
            log.status = "error"
            log.detail = f"Scrape failed: {str(e)}"
        
        self.session_logs.append(log)
        return log
    
    async def close(self):
        """Close the browser and cleanup."""
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()
        
        log = BrowserAgentLog("close", "Browser agent shut down")
        log.status = "success"
        self.session_logs.append(log)
    
    def get_logs(self) -> List[Dict[str, Any]]:
        """Get all session logs."""
        return [log.to_dict() for log in self.session_logs]


# Global agent instance (lazy initialization)
_agent: Optional[BrowserAgent] = None


async def get_browser_agent() -> BrowserAgent:
    """Get or create the global browser agent instance."""
    global _agent
    if _agent is None:
        _agent = BrowserAgent(headless=True)
        await _agent.initialize()
    return _agent


async def scrape_github_readme(github_url: str) -> Dict[str, Any]:
    """Convenience function to scrape a GitHub README."""
    agent = await get_browser_agent()
    log = await agent.scrape_readme(github_url)
    return log.to_dict()


async def agent_health_check() -> Dict[str, Any]:
    """Check if the browser agent is ready."""
    global _agent
    
    if _agent is None:
        # Try to initialize
        _agent = BrowserAgent(headless=True)
        initialized = await _agent.initialize()
        return {
            "status": "ready" if initialized else "degraded",
            "playwright_installed": initialized,
            "logs_count": len(_agent.session_logs)
        }
    
    return {
        "status": "ready",
        "playwright_installed": True,
        "logs_count": len(_agent.session_logs)
    }
