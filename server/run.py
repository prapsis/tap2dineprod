import os
import uvicorn
from django.core.asgi import get_asgi_application
from django.contrib.staticfiles.handlers import StaticFilesHandler
from decouple import config

# Set the Django settings module before importing anything Django-related
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tap2dine.settings')

if __name__ == "__main__":
    application = StaticFilesHandler(get_asgi_application())
    uvicorn.run(
        "tap2dine.asgi:application",
        host=int(config("PORT", 8000)),
        port=8000,
        reload=False,
        ws="websockets"
    )