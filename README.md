# Generic Booking & Reservation API 🗓️

A robust, domain-agnostic RESTful API built with **NestJS**, **Prisma ORM**, and **PostgreSQL**. Designed as a generic reservation engine capable of powering doctor appointments, hotel rooms, venue rentals, and service scheduling.

---

## 🌟 Key Features

- **Domain Abstraction:** Bookable entities are modeled as generic `Resources`, allowing the backend to serve diverse domain use cases without schema modifications.
- **Dynamic Operating Schedules:** Define recurring weekly availability (`Schedule`) per resource with configurable time windows.
- **Double-Booking Guard:** Robust database overlap queries prevent concurrent or overlapping reservations down to the minute:
  $$\text{ExistingStart} < \text{NewEnd} \quad \text{AND} \quad \text{ExistingEnd} > \text{NewStart}$$
- **Booking Lifecycle State Machine:** Tracks reservation transitions (`PENDING` → `CONFIRMED` → `COMPLETED` / `CANCELLED`).
- **Input Validation & Safety:** Custom NestJS validation pipes enforce ISO 8601 date formats, future scheduling limits, and chronological constraints (`endTime > startTime`).

---

## 🏗️ Architecture & Entities

The API is built around 4 core relational models:
  -User
  -Resource
  -Booking
  -Schedule