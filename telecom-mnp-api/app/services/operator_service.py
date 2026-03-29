from app.repositories.operator_repository import create_operator, get_all_operators, get_operator_by_id
from app.exceptions.custom_exceptions import NotFoundException

async def add_operator(data):
    operator_data = data.dict()
    return await create_operator(operator_data)

async def list_operators():
    return await get_all_operators()

async def fetch_operator(operator_id: str):
    operator = await get_operator_by_id(operator_id)
    if not operator:
        raise NotFoundException("Operator not found")
    return operator