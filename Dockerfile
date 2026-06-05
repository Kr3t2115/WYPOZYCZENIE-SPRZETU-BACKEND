FROM ubuntu:latest
LABEL authors="kret"

ENTRYPOINT ["top", "-b"]