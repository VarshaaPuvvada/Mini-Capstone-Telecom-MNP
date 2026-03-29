import re

def validate_mobile_number(number: str) -> bool:
    return bool(re.fullmatch(r"\d{10}", number))

def validate_operator_name(name: str) -> bool:
    return 2 <= len(name) <= 50