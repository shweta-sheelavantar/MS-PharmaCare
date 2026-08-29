package com.auth.exception;

public class DuplicateMedicineException extends RuntimeException {
    public DuplicateMedicineException(String message) {
        super(message);
    }
}
