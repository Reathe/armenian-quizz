# Armenian Alphabet

How to build the container for oracle linux:

```bash
docker login
docker build --platform linux/arm64/v8 -t reathe/armenian-alphabet .
docker push reathe/armenian-alphabet
```

How to run the container:

```yml
services:
  armenian-alphabet:
    image: reathe/armenian-alphabet
    container_name: armenian-alphabet
    restart: unless-stopped
    network_mode: bridge
    ports:
      - "8080:8080"
```

OR

```bash
sudo docker pull reathe/armenian-alphabet
sudo docker run -p 8080:8080 reathe/armenian-alphabet
```
