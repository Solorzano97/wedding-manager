package com.weddingplatform.wedding.infrastructure.controller;
import com.weddingplatform.shared.application.dto.PageResponse;
import com.weddingplatform.shared.infrastructure.security.UserPrincipal;
import com.weddingplatform.wedding.application.dto.WeddingDtos.*;
import com.weddingplatform.wedding.application.usecase.CreateWeddingUseCase;
import com.weddingplatform.wedding.application.usecase.GetWeddingUseCase;
import com.weddingplatform.wedding.domain.model.Wedding;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/weddings") @Tag(name = "Weddings")
public class WeddingController {
    private final CreateWeddingUseCase createUC;
    private final GetWeddingUseCase getUC;
    public WeddingController(CreateWeddingUseCase createUC, GetWeddingUseCase getUC) {
        this.createUC = createUC; this.getUC = getUC;
    }
    @PostMapping @PreAuthorize("hasRole('COUPLE')")
    public ResponseEntity<WeddingResponse> create(@AuthenticationPrincipal UserPrincipal p, @Valid @RequestBody CreateWeddingRequest req) {
        Wedding w = createUC.execute(p.getId(), req);
        return ResponseEntity.status(HttpStatus.CREATED).body(getUC.getByUuid(w.uuid()));
    }
    @GetMapping("/me") @PreAuthorize("hasRole('COUPLE')")
    public ResponseEntity<PageResponse<WeddingResponse>> myWeddings(@AuthenticationPrincipal UserPrincipal p,
        @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(getUC.getMyWeddings(p.getId(), PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }
    @GetMapping("/{uuid}")
    public ResponseEntity<WeddingResponse> getByUuid(@PathVariable String uuid) { return ResponseEntity.ok(getUC.getByUuid(uuid)); }
    @GetMapping("/slug/{slug}")
    public ResponseEntity<WeddingResponse> getBySlug(@PathVariable String slug) { return ResponseEntity.ok(getUC.getBySlug(slug)); }
}
