#pragma once
#include <cstdint>

namespace TileProperty {

	enum class Material : uint8_t {
		rock,
		soil,
		grass,
		ice
	};

	enum class Flip : uint8_t {
		right,
		left
	};

	enum class Shape : uint8_t {
		square,
		triangle,
		rectangle,
		trapezoid,
		wedge
	};

	enum class Pivot : uint8_t {
		bottom_left,
		bottom_right,
		top_right,
		top_left
	};
}

typedef struct {
	uint8_t column;
	uint8_t row;
	TileProperty::Shape shape;
	TileProperty::Material material;
	TileProperty::Flip flip;
	TileProperty::Pivot pivot;
} TileData;