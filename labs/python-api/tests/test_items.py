import pytest
from fastapi.testclient import TestClient

from app import main

client = TestClient(main.app)


@pytest.fixture(autouse=True)
def reset():
    main.items.clear()
    main.next_id = 1


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_create_and_get():
    res = client.post("/items", json={"name": "pen", "price": 3})
    assert res.status_code == 201
    assert res.json() == {"id": 1, "name": "pen", "price": 3}
    assert client.get("/items/1").json() == res.json()


def test_list():
    client.post("/items", json={"name": "a"})
    client.post("/items", json={"name": "b"})
    assert [i["name"] for i in client.get("/items").json()] == ["a", "b"]


def test_update():
    client.post("/items", json={"name": "a"})
    res = client.put("/items/1", json={"name": "b", "price": 5})
    assert res.json() == {"id": 1, "name": "b", "price": 5}


def test_delete():
    client.post("/items", json={"name": "a"})
    assert client.delete("/items/1").status_code == 204
    assert client.get("/items/1").status_code == 404


def test_missing_is_404():
    assert client.get("/items/99").status_code == 404
    assert client.put("/items/99", json={"name": "x"}).status_code == 404
    assert client.delete("/items/99").status_code == 404
