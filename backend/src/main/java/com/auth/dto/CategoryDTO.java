package com.auth.dto;

public class CategoryDTO {
    private Long id;
    private String name;
    private String slug;
    private String image;
    private String description;
    private Integer itemCount;

    public CategoryDTO() {}

    public CategoryDTO(Long id, String name, String slug, String image, String description, Integer itemCount) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.image = image;
        this.description = description;
        this.itemCount = itemCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }
}
