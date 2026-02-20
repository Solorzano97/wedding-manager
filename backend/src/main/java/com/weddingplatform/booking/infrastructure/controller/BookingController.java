package com.weddingplatform.booking.infrastructure.controller;
import com.weddingplatform.booking.application.dto.BookingDtos.*;
import com.weddingplatform.booking.application.usecase.ManageAppointmentsUseCase;
import com.weddingplatform.booking.application.usecase.ManageQuotesUseCase;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.infrastructure.security.UserPrincipal;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/weddings/{weddingId}")
@Tag(name = "Booking") @SecurityRequirement(name = "bearerAuth")
public class BookingController {
    private final ManageQuotesUseCase quotesUC;
    private final ManageAppointmentsUseCase apptsUC;
    public BookingController(ManageQuotesUseCase quotesUC, ManageAppointmentsUseCase apptsUC) {
        this.quotesUC = quotesUC; this.apptsUC = apptsUC;
    }

    // --- Quotes ---
    @PostMapping("/quotes") @PreAuthorize("hasRole('COUPLE')")
    public ResponseEntity<QuoteResponse> createQuote(@PathVariable Long weddingId,
        @AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody CreateQuoteRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quotesUC.createQuote(p.getId(), weddingId, req));
    }
    @GetMapping("/quotes") @PreAuthorize("hasAnyRole('COUPLE','VENDOR')")
    public ResponseEntity<PageResponse<QuoteResponse>> listQuotes(@PathVariable Long weddingId,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(quotesUC.getByWedding(weddingId, PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }
    @PatchMapping("/quotes/{uuid}/status") @PreAuthorize("hasAnyRole('COUPLE','VENDOR')")
    public ResponseEntity<QuoteResponse> updateQuoteStatus(@PathVariable Long weddingId,
        @PathVariable String uuid, @Valid @RequestBody UpdateQuoteStatusRequest req) {
        return ResponseEntity.ok(quotesUC.updateStatus(uuid, req));
    }

    // --- Appointments ---
    @PostMapping("/appointments") @PreAuthorize("hasRole('COUPLE')")
    public ResponseEntity<AppointmentResponse> createAppointment(@PathVariable Long weddingId,
        @AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody CreateAppointmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(apptsUC.create(p.getId(), weddingId, req));
    }
    @GetMapping("/appointments") @PreAuthorize("hasAnyRole('COUPLE','VENDOR')")
    public ResponseEntity<PageResponse<AppointmentResponse>> listAppointments(@PathVariable Long weddingId,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(apptsUC.getByWedding(weddingId, PageRequest.of(page, size, Sort.by("appointmentDate"))));
    }
    @PatchMapping("/appointments/{uuid}/status") @PreAuthorize("hasAnyRole('COUPLE','VENDOR')")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(@PathVariable Long weddingId,
        @PathVariable String uuid, @Valid @RequestBody UpdateAppointmentStatusRequest req) {
        return ResponseEntity.ok(apptsUC.updateStatus(uuid, req));
    }
}
