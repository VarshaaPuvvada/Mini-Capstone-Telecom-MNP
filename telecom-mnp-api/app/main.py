from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.controllers.auth_controller import router as auth_router
from fastapi.security import HTTPBearer
from app.controllers import port_controller,operator_controller,admin_controller,otp_controller
from app.exceptions.exception_handlers import (
    not_found_exception_handler,
    unauthorized_exception_handler,
    bad_request_exception_handler
)
from app.exceptions.custom_exceptions import (
    NotFoundException,
    UnauthorizedException,
    BadRequestException
)

app = FastAPI(title="Telecom MNP API")

# Register exception handlers
app.add_exception_handler(NotFoundException, not_found_exception_handler)
app.add_exception_handler(UnauthorizedException, unauthorized_exception_handler)
app.add_exception_handler(BadRequestException, bad_request_exception_handler)

security = HTTPBearer()

app.include_router(auth_router,prefix="/auth",tags=["auth"])
app.include_router(port_controller.router)
app.include_router(operator_controller.router)
app.include_router(admin_controller.router)
app.include_router(otp_controller.router)

@app.get("/")
def root():
    return {"message": "Telecom MNP Backend is Running "}


