FROM python:3.14-alpine AS base

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

FROM base AS development

RUN chown -R 1000:1000 /app
USER 1000
EXPOSE 8000

CMD ["python", "manage.py", "runserver"]

FROM base AS production
RUN chown -R 1000:1000 /app
USER 1000
EXPOSE 8000

CMD ["gunicorn", "pixworld.wsgi:application", "--workers", "3", "--no-control-socket", "--worker-tmp-dir", "/dev/shm", "--access-logfile", "-", "--error-logfile", "-", "--capture-output", "--enable-stdio-inheritance", "--log-level", "info", "--bind", "0.0.0.0:8000"]
