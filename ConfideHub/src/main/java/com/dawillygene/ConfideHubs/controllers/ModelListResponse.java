package com.dawillygene.ConfideHubs.controllers;

import com.dawillygene.ConfideHubs.model.GeminiModel;

import java.util.List;

public record ModelListResponse(String object, List<GeminiModel> data) {
}
