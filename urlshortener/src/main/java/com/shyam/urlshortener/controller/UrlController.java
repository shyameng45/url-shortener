package com.shyam.urlshortener.controller;

import com.shyam.urlshortener.model.Url;
import com.shyam.urlshortener.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    // POST /api/shorten → long URL do, short code milega
    @PostMapping("/api/shorten")
    public ResponseEntity<Url> shortenUrl(@RequestBody ShortenRequest request) {
        Url url = urlService.shortenUrl(request.getOriginalUrl());
        return ResponseEntity.ok(url);
    }

    // GET /{shortCode} → original URL pe redirect
    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        Optional<Url> url = urlService.getOriginalUrl(shortCode);
        return url.map(u -> ResponseEntity
                        .status(302)
                        .<Void>build())
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/stats/{shortCode} → click count dekho
    @GetMapping("/api/stats/{shortCode}")
    public ResponseEntity<Url> getStats(@PathVariable String shortCode) {
        Optional<Url> url = urlService.getOriginalUrl(shortCode);
        return url.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Request body ke liye helper class
    static class ShortenRequest {
        private String originalUrl;
        public String getOriginalUrl() { return originalUrl; }
        public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }
    }
}

