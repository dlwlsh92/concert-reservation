-- CreateIndex
CREATE INDEX "ConcertEvent_concertId_startDate_idx" ON "ConcertEvent"("concertId", "startDate");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "Seat_concertEventId_idx" ON "Seat"("concertEventId");
