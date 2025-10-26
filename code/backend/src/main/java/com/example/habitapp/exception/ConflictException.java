// 1. Кастомное исключение
package com.example.habitapp.exception;

public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
