package org.isaclarsen.backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class PomoSettings {

    private int focusMinutes = 25;
    private int relaxMinutes = 5;
    private int questionCount = 3;

    public PomoSettings() {}

    public int getFocusMinutes() {
        return focusMinutes;
    }

    public void setFocusMinutes(int focusMinutes) {
        this.focusMinutes = focusMinutes;
    }

    public int getRelaxMinutes() {
        return relaxMinutes;
    }

    public void setRelaxMinutes(int relaxMinutes) {
        this.relaxMinutes = relaxMinutes;
    }

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
    }
}
