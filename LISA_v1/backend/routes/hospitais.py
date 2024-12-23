# Importações de bibliotecas externas e padrão
import os
import time
import httpx
from fastapi import APIRouter, HTTPException
from typing import List
from dotenv import load_dotenv

# Importações de módulos internos
from schemas.hospital import Hospital

# Carrega variáveis de ambiente
load_dotenv()
API_KEY = os.getenv("API_KEY")

# Defini o roteador para as rotas de hospitais
router = APIRouter()

# Busca hospitais próximos com base na latitude e longitude fornecidas
@router.get("/api/hospitais", response_model=List[Hospital])
async def get_hospitais(latitude: float, longitude: float):
    # URL inicial para consulta de hospitais
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=5000&type=hospital&key={API_KEY}"
    hospitais = []

    async with httpx.AsyncClient() as client:
        while url:
            response = await client.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Erro ao buscar hospitais.")

            data = response.json()
            # Extrai e adiciona cada hospital à lista
            for result in data.get("results", []):
                hospitais.append(Hospital(
                    id=result['place_id'],
                    name=result['name'],
                    latitude=result['geometry']['location']['lat'],
                    longitude=result['geometry']['location']['lng'],
                ))

            # Verifica se há uma próxima página para continuar a busca
            next_page_token = data.get("next_page_token")
            if next_page_token:
                url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken={next_page_token}&key={API_KEY}"
                time.sleep(2)  # Aguarda um tempo necessário para evitar erro de taxa de requisições
            else:
                url = None

    return hospitais