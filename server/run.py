import os
import uvicorn
from django.core.asgi import get_asgi_application
from django.contrib.staticfiles.handlers import StaticFilesHandler

# Set the Django settings module before importing anything Django-related
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tap2dine.settings')

if __name__ == "__main__":
    application = StaticFilesHandler(get_asgi_application())
    uvicorn.run(
        "tap2dine.asgi:application",
        host="127.0.0.1",
        port=8000,
        reload=True,
        ws="websockets"
    )