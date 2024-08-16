FROM python:3.11

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
# update PATH environment variable
ENV PATH=/root/.local:$PATH
COPY . .
CMD ["python3", "src/app.py"]
