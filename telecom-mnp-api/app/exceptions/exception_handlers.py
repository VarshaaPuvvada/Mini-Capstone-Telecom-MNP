from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from app.exceptions.custom_exceptions import NotFoundException, UnauthorizedException, BadRequestException

async def not_found_exception_handler(request: Request, exc: NotFoundException):
    return JSONResponse(status_code=404, content={"detail": exc.detail})

async def unauthorized_exception_handler(request: Request, exc: UnauthorizedException):
    return JSONResponse(status_code=401, content={"detail": exc.detail})

async def bad_request_exception_handler(request: Request, exc: BadRequestException):
    return JSONResponse(status_code=400, content={"detail": exc.detail})