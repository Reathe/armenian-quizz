# Armenian Alphabet
Source code for the [Learn Armenian Alphabet website](https://hay.rafserver.com).

---
## Docker
### How to build the container for oracle linux:

```bash
docker login
docker build --platform linux/arm64/v8 -t reathe/armenian-alphabet .
docker push reathe/armenian-alphabet
```

### How to run the container:

Using docker compose `docker-compose.yml`:
```yml
services:
  armenian-alphabet:
    image: reathe/armenian-alphabet
    restart: unless-stopped
    ports:
      - "8080:8080"
```

Using the command line: 
```bash
sudo docker pull reathe/armenian-alphabet
sudo docker run -p 8080:8080 reathe/armenian-alphabet
```
