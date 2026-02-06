from pydantic_settings import BaseSettings
from typing import List, Union

class Settings(BaseSettings):
    # API Keys
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    semantic_scholar_api_key: str = ""

    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = True

    # CORS - can be a list or comma-separated string
    cors_origins: Union[List[str], str] = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.cors_origins, str):
            return [origin.strip() for origin in self.cors_origins.split(",")]
        return self.cors_origins

    # Upload Configuration
    max_upload_size: int = 50 * 1024 * 1024  # 50MB
    upload_dir: str = "uploads"

    # Analysis Configuration
    max_papers_per_technique: int = 5
    paper_min_year: int = 2022
    similarity_threshold: float = 0.7

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
