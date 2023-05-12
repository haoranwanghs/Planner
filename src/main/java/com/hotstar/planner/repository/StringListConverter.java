package com.hotstar.planner.repository;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.persistence.AttributeConverter;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

public class StringListConverter implements AttributeConverter<List<String>, String> {
    private static final String DELIMITER = ",";

    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        String stringData = "";
        if (CollectionUtils.isNotEmpty(attribute)) {
            stringData = attribute.stream()
                .map(Object::toString).map(String::trim)
                .collect(Collectors.joining(DELIMITER));
        }
        return stringData;
    }

    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        List<String> data = Collections.emptyList();
        if (StringUtils.isNotBlank(dbData)) {
            data = Arrays.stream(dbData.split(DELIMITER))
                .filter(Objects::nonNull)
                .map(String::trim)
                .collect(Collectors.toList());
        }
        return data;
    }
}