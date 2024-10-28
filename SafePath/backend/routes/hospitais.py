# Importações de bibliotecas externas e padrão
import os
import time
import httpx
from fastapi import APIRouter, HTTPException
from typing import List
from dotenv import load_dotenv

# Importações de módulos internos
from schemas.hospital import Hospital

# Carregar variáveis de ambiente
load_dotenv()
API_KEY = os.getenv("API_KEY")

# Definir o roteador para as rotas de hospitais
router = APIRouter()

@router.get("/hospitais", response_model=List[Hospital])
async def get_hospitais(latitude: float, longitude: float):
    """
    Busca hospitais próximos com base na latitude e longitude fornecidas.

    Args:
    - latitude (float): A latitude do local de busca.
    - longitude (float): A longitude do local de busca.

    Returns:
    - List[Hospital]: Lista de hospitais encontrados.

    """
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key is missing")

    # URL inicial para consulta de hospitais
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={latitude},{longitude}&radius=5000&type=hospital&key={API_KEY}"
    hospitais = []

    async with httpx.AsyncClient() as client:
        while url:
            response = await client.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Erro ao buscar hospitais")

            data = response.json()
            # Extrair e adicionar cada hospital à lista
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
                time.sleep(2)  # Aguardar tempo necessário para evitar erro de taxa de requisições
            else:
                url = None

    return hospitais