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
import com.weddingplatform.vendor.domain.repository.VendorProfileRepository;

@RestController
@Tag(name = "Booking") @SecurityRequirement(name = "bearerAuth")
public class BookingController {
    private final ManageQuotesUseCase quotesUC;
    private final ManageAppointmentsUseCase apptsUC;
    private final VendorProfileRepository vendorProfileRepo;
    public BookingController(ManageQuotesUseCase quotesUC, ManageAppointmentsUseCase apptsUC,
                             VendorProfileRepository vendorProfileRepo) {
        this.quotesUC = quotesUC; this.apptsUC = apptsUC; this.vendorProfileRepo = vendorProfileRepo;
    }

    // --- Quotes (by wedding - for couples) ---
    @PostMapping("/weddings/{weddingId}/quotes") @PreAuthorize("hasRole('COUPLE')")
    public ResponseEntity<QuoteResponse> createQuote(@PathVariable Long weddingId,
        @AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody CreateQuoteRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quotesUC.createQuote(p.getId(), weddingId, req));
    }
    @GetMapping("/weddings/{weddingId}/quotes") @PreAuthorize("hasAnyRole('COUPLE','VENDOR')")
    public ResponseEntity<PageResponse<QuoteResponse>> listQuotes(@PathVariable Long weddingId,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(quotesUC.getByWedding(weddingId, PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }
    @PatchMapping("/weddings/{weddingId}/quotes/{uuid}/status") @PreAuthorize("hasAnyRole('COUPLE','VENDOR')")
    public ResponseEntity<QuoteResponse> updateQuoteStatus(@PathVariable Long weddingId,
        @PathVariable String uuid, @Valid @RequestBody UpdateQuoteStatusRequest req) {
        return ResponseEntity.ok(quotesUC.updateStatus(uuid, req));
    }

    // --- Appointments (by wedding - for couples) ---
    @PostMapping("/weddings/{weddingId}/appointments") @PreAuthorize("hasRole('COUPLE')")
    public ResponseEntity<AppointmentResponse> createAppointment(@PathVariable Long weddingId,
        @AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody CreateAppointmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(apptsUC.create(p.getId(), weddingId, req));
    }
    @GetMapping("/weddings/{weddingId}/appointments") @PreAuthorize("hasAnyRole('COUPLE','VENDOR')")
    public ResponseEntity<PageResponse<AppointmentResponse>> listAppointments(@PathVariable Long weddingId,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(apptsUC.getByWedding(weddingId, PageRequest.of(page, size, Sort.by("appointmentDate"))));
    }
    @PatchMapping("/weddings/{weddingId}/appointments/{uuid}/status") @PreAuthorize("hasAnyRole('COUPLE','VENDOR')")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(@PathVariable Long weddingId,
        @PathVariable String uuid, @Valid @RequestBody UpdateAppointmentStatusRequest req) {
        return ResponseEntity.ok(apptsUC.updateStatus(uuid, req));
    }

    // === VENDOR-SPECIFIC ENDPOINTS (no weddingId required) ===

    @GetMapping("/vendors/me/appointments") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<PageResponse<AppointmentResponse>> myVendorAppointments(
        @AuthenticationPrincipal UserPrincipal p,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        var profile = vendorProfileRepo.findByUserId(p.getId())
            .orElseThrow(() -> new com.weddingplatform.shared.domain.exception.ResourceNotFoundException("VendorProfile", "userId", p.getId()));
        return ResponseEntity.ok(apptsUC.getByVendorProfile(profile.id(), PageRequest.of(page, size, Sort.by("appointmentDate"))));
    }

    @PatchMapping("/vendors/me/appointments/{uuid}/status") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<AppointmentResponse> updateVendorAppointmentStatus(
        @PathVariable String uuid, @Valid @RequestBody UpdateAppointmentStatusRequest req) {
        return ResponseEntity.ok(apptsUC.updateStatus(uuid, req));
    }

    @GetMapping("/vendors/me/quotes") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<PageResponse<QuoteResponse>> myVendorQuotes(
        @AuthenticationPrincipal UserPrincipal p,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        var profile = vendorProfileRepo.findByUserId(p.getId())
            .orElseThrow(() -> new com.weddingplatform.shared.domain.exception.ResourceNotFoundException("VendorProfile", "userId", p.getId()));
        return ResponseEntity.ok(quotesUC.getByVendorProfile(profile.id(), PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @PatchMapping("/vendors/me/quotes/{uuid}/status") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<QuoteResponse> updateVendorQuoteStatus(
        @PathVariable String uuid, @Valid @RequestBody UpdateQuoteStatusRequest req) {
        return ResponseEntity.ok(quotesUC.updateStatus(uuid, req));
    }

    @PutMapping("/vendors/me/quotes/{uuid}/respond") @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<QuoteResponse> respondToQuote(
        @PathVariable String uuid, @Valid @RequestBody RespondQuoteRequest req) {
        return ResponseEntity.ok(quotesUC.respondToQuote(uuid, req));
    }
}
