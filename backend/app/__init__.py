from flask import Flask
from flask_cors import CORS
from .config import Config
from flask_caching import Cache

cache = Cache()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app, origins=['http://localhost:5173'], supports_credentials=True)
    cache.init_app(app, config={'CACHE_TYPE': 'simple'})




    # Register the blueprints



    from .music import music
    app.register_blueprint(music, url_prefix='/music')

    @app.route('/')
    def hello():
        return 'Hello, World!'

    return app
