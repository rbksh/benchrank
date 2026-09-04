# BenchRank

**Low-Latency Trading Infrastructure and Benchmarking Platform**
* Author: Shesh Shiromani*

BenchRank is a distributed benchmarking and hosting platform engineered strictly for evaluating high-performance trading infrastructure under extreme concurrent load. 

It was built to provide a fault-isolated arena where developers can deploy custom matching engines and exchange backends, subjecting them to massive, simulated market activity. The platform captures real-time latency distributions, throughput ceilings, execution correctness, and system resilience, streaming this telemetry to a dynamic leaderboard.

## The Problem Statement: Why?

Building a high-throughput matching engine is difficult, but accurately measuring its performance is a harder systems engineering problem. 

Standard load-testing tools like JMeter or Locust are designed for stateless HTTP APIs. They are fundamentally incapable of testing stateful, low-latency financial infrastructure for a few key reasons:
1. **Coordinated Omission:** Traditional tools wait for a response before sending the next request. If the matching engine stalls, the load generator slows down, artificially hiding tail latencies. 
2. **Domain Ignorance:** Financial systems require sequential correctness. A standard load generator cannot verify if a limit order was correctly matched against the book; it only checks if a 200 OK was returned.
3. **Client-Side Bottlenecks:** To measure microsecond latency, the benchmarking tool itself cannot suffer from garbage collection pauses or thread-contention delays.

## The Solution: How?

BenchRank acts as a black-box testing arena. Competitors submit their exchange backend, and the platform handles the rest. 

The system isolates the submitted engine in a tightly constrained containerized environment. Once the engine is initialized, BenchRank spins up a distributed fleet of worker nodes. These nodes establish thousands of concurrent, persistent TCP/WebSocket connections to the target and bombard it with order flow. 

Instead of waiting for responses to send the next wave, BenchRank uses a scheduled emission model to avoid coordinated omission, capturing the true latency of every single request from transmission to acknowledgment.

## Purpose and Audience

BenchRank was designed for the IICPC Summer Hackathon to evaluate competitive engineering, but its architecture serves a practical purpose for:
*   **Systems Engineers:** Validating the performance characteristics of new order-matching algorithms before production.
*   **Infrastructure Teams:** Stress-testing the underlying network and orchestration layer to find the breaking points of a backend architecture.
*   **FinTech Developers:** Ensuring that a trading system can maintain sequential correctness and transactional integrity during simulated flash crashes.

## System Architecture

The platform operates on four primary subsystems:

1.  **Deployment & Isolation:** User engines are containerized and deployed into a Kubernetes cluster. We utilize strict Linux cgroups to limit CPU cycles, memory allocation, and network bandwidth. This ensures hardware equality across all benchmarks and prevents noisy neighbor problems on the host machines.
2.  **Distributed Load Generation:** A horizontally scaled cluster of worker nodes written in Go/Rust. These nodes manage thousands of concurrent connections. We utilized lock-free data structures and pre-allocated memory pools in the load generators to ensure the benchmarking tool itself introduces zero measurable latency.
3.  **Telemetry Ingestion:** Every outbound order and inbound acknowledgment is timestamped using high-resolution monotonic clocks. This data is asynchronously pushed to an Apache Kafka cluster, preventing disk I/O bottlenecks from slowing down the order generation process.
4.  **Verification Engine:** Speed is irrelevant if the math is wrong. BenchRank maintains a shadow ledger. After the test concludes, it cross-references the matching engine's final state against an expected deterministic state to check for race conditions, dropped orders, or double-spending.

## Infrastructure and Deployment

The environment is heavily automated to support rapid iteration. 
*   **Infrastructure as Code:** Terraform is used to provision the underlying compute instances and configure the network topology.
*   **Orchestration:** Kubernetes handles the lifecycle of both the load generation fleet and the contestant engines. 
*   **Data Layer:** TimescaleDB acts as the time-series store for telemetry, heavily optimized for high-ingest write workloads. Redis is utilized as an in-memory cache to serve the live leaderboard without querying the primary database.

## Artificial Intelligence Integration

In load testing, static or purely random data is a flaw. A well-designed matching engine can compress, cache, or predict purely random order flow, resulting in falsely optimistic performance metrics.

To counteract this, BenchRank uses a lightweight machine learning model—specifically a Markov chain and stochastic volatility generator—to synthesize realistic market microstructures. The AI generates adversarial order sequences: sustained directional momentum, sudden order book imbalances, and simulated flash crashes. This forces the matching engine to continuously alter its state under duress, providing a much more accurate simulation of live market conditions.

## Technical Stack Details

*   **Load Generator Fleet (Go/Rust):** Chosen for deterministic memory management and high-concurrency capabilities. Goroutines and Rust's asynchronous runtime allow us to maintain thousands of open sockets with minimal memory overhead.
*   **Message Broker (Apache Kafka):** Serves as the high-throughput, low-latency buffer between the order execution workers and the telemetry database.
*   **Database (TimescaleDB / Redis):** Timescale handles the aggregation of millions of latency data points, while Redis manages the pub/sub streams required for the real-time UI.
*   **Frontend (Next.js):** A React-based interface that subscribes to WebSocket streams, rendering high-frequency updates to the leaderboard and latency distribution histograms (using HDR histograms for accurate p99 representations).
*   **Environment (Docker / Kubernetes):** Provides the mathematical fairness and isolation required for a competitive benchmarking platform.

## Local Environment Setup

To run the BenchRank platform locally for testing your own infrastructure, you need Docker, Docker Compose, Make, and Go 1.21+ installed on your host machine.

### 1. Initialize the Core Services
Start the supporting infrastructure, including Kafka, TimescaleDB, and the web interface.
```bash
git clone [https://github.com/rbksh/benchrank.git](https://github.com/rbksh/benchrank.git)
cd benchrank
docker-compose up -d --build
```
