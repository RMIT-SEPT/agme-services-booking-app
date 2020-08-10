package com.rmit.sept.lemonfruits.majorproject.exception;

public class InvalidJwtAuthenticationException extends Throwable {

    public InvalidJwtAuthenticationException(String invalidToken) {
        super(invalidToken + " is not valid");
    }
}
