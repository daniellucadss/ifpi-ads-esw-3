# Importação de bibliotecas externas
from pydantic import BaseModel

# Definição do modelo de dados para um hospital
class Hospital(BaseModel):
    id: str            
    name: str          
    latitude: float    
    longitude: float   