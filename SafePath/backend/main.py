# Importações de bibliotecas externas e padrão
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importação de módulos internos
from routes.hospitais import router as hospitals_router

# Instância do aplicativo FastAPI
app = FastAPI()

# Configuração do CORS para permitir todas as origens (desenvolvimento)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas para a rota de hospitais
app.include_router(hospitals_router)