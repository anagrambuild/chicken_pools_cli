# Stage 1: Build yamlfmt
FROM golang:1 AS go-builder
# defined from build kit
# DOCKER_BUILDKIT=1 docker build . -t ...
ARG TARGETARCH

# Install yamlfmt
WORKDIR /yamlfmt
RUN go install github.com/google/yamlfmt/cmd/yamlfmt@latest && \
    strip $(which yamlfmt) && \
    yamlfmt --version

FROM jac18281828/tsdev:latest

ENV DEBIAN_FRONTEND=noninteractive
RUN sudo apt-get update && \
    sudo apt-get install -y -q --no-install-recommends \
    unzip && \
    sudo apt-get clean && \
    sudo rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*    

    ENV USER=tsdev
    # Install Python 3.10
    # fixes node-gyp error
    RUN sudo apt-get update -y && sudo apt-get upgrade -y
    RUN sudo apt-get remove python3 -y
    RUN sudo apt-get autoremove -y
    RUN sudo apt-get install -y wget \
             build-essential \
             checkinstall \
             libncursesw5-dev \
             libssl-dev \
             libsqlite3-dev \
             tk-dev \
             libgdbm-dev \
             libc6-dev \
             libbz2-dev \
             libffi-dev \
             zlib1g-dev
    RUN mkdir -p /usr/local/src
    RUN sudo chown -R ${USER}:${USER} /usr/local/src
    WORKDIR /usr/local/src
    RUN wget https://www.python.org/ftp/python/3.10.9/Python-3.10.9.tgz
    RUN tar xzf Python-3.10.9.tgz && rm Python-3.10.9.tgz
    WORKDIR /usr/local/src/Python-3.10.9
    RUN ./configure --enable-optimizations
    RUN make -j
    RUN sudo make install && sudo make clean    
    
# Install yamlfmt
COPY --chown=${USER}:${USER} --from=go-builder /go/bin/yamlfmt /go/bin/yamlfmt    

WORKDIR /workspaces/react_metamask
COPY --chown=tsdev:tsdev . .

USER tsdev
ADD --chown=${USER}:${USER} --chmod=555 https://bun.sh/install /bun/install.sh

RUN /bun/install.sh && \
    sudo rm -rf /bun

ENV PATH="/home/tsdev/.bun/bin:/go/bin:${PATH}"
