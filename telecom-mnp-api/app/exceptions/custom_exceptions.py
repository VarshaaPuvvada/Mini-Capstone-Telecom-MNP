class NotFoundException(Exception):
    def __init__(self, detail: str = "Resource not found"):
        self.detail = detail

class UnauthorizedException(Exception):
    def __init__(self, detail: str = "Unauthorized access"):
        self.detail = detail

class BadRequestException(Exception):
    def __init__(self, detail: str = "Bad request"):
        self.detail = detail