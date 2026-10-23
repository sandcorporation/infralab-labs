from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

items: dict[int, dict] = {}
next_id = 1


class ItemIn(BaseModel):
    name: str
    price: int = 0


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/items")
def list_items():
    return list(items.values())


@app.post("/items", status_code=201)
def create_item(body: ItemIn):
    global next_id
    item = {"id": next_id, "name": body.name, "price": body.price}
    items[next_id] = item
    next_id += 1
    return item


@app.get("/items/{item_id}")
def get_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="not found")
    return items[item_id]


@app.put("/items/{item_id}")
def update_item(item_id: int, body: ItemIn):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="not found")
    items[item_id].update(name=body.name, price=body.price)
    return items[item_id]


@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="not found")
    del items[item_id]
