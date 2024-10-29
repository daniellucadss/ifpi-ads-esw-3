# Importações de bibliotecas externas e padrão
import os
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()
API_KEY = os.getenv("API_KEY")

# Definir o roteador para as rotas do mapa
router = APIRouter()

# Retorna a URL da API do Google Maps
@router.get("/api/mapa")
async def get_mapa():
    return {"url": f"https://maps.googleapis.com/maps/api/js?key={API_KEY}"}
