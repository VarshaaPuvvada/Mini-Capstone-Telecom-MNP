from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from datetime import datetime, timedelta

VISIT_RECORD = {}

class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 10, period_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.period = timedelta(seconds=period_seconds)

    async def dispatch(self, request: Request, call_next):
        ip = request.client.host
        now = datetime.utcnow()
        visits = VISIT_RECORD.get(ip, [])
        # Remove old requests
        visits = [t for t in visits if now - t < self.period]
        if len(visits) >= self.max_requests:
            return JSONResponse(status_code=429, content={"detail": "Rate limit exceeded"})
        visits.append(now)
        VISIT_RECORD[ip] = visits
        return await call_next(request)