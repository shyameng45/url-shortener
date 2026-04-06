package com.shyam.urlshortener.service;

import com.shyam.urlshortener.model.Url;
import com.shyam.urlshortener.repository.UrlRepository;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;

    @CachePut(value = "urls", key = "#result.shortCode")
    public Url shortenUrl(String originalUrl) {
        String shortCode = generateShortCode(originalUrl);

        // Already exists? Return karo
        Optional<Url> existing = urlRepository.findByShortCode(shortCode);
        if (existing.isPresent()) {
            return existing.get();
        }

        Url url = new Url();
        url.setOriginalUrl(originalUrl);
        url.setShortCode(shortCode);
        return urlRepository.save(url);
    }

    @Cacheable(value = "urls", key = "#shortCode")
    public Optional<Url> getOriginalUrl(String shortCode) {
        System.out.println("Cache MISS! DB se fetch: " + shortCode);
        Optional<Url> url = urlRepository.findByShortCode(shortCode);
        url.ifPresent(u -> {
            u.setClickCount(u.getClickCount() + 1);
            urlRepository.save(u);
        });
        return url;
    }

    private String generateShortCode(String url) {
        String base62 = "abcdefghijklmnopqrstuvwxyz" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                "0123456789";
        long hash = Math.abs(url.hashCode());
        StringBuilder code = new StringBuilder();
        while (hash > 0) {
            code.append(base62.charAt((int)(hash % 62)));
            hash /= 62;
        }
        return code.toString();
    }
}