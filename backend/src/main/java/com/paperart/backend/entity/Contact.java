	package com.paperart.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "contact")
@Getter
@Setter
public class Contact extends BaseEntity {

    // 聯絡人
    private String contactPerson;

    // 公司電話
    private String phone;

    // 手機
    private String mobile;

    // Email
    private String email;

    // 地址
    @Lob
    private String address;

    // 社群
    private String facebook;

    private String instagram;

    private String line;

    // 額外資訊（建議一起做）
    private String website;

    private String businessHours;

	@Lob
	@Column(columnDefinition = "TEXT")
    private String googleMap;
}