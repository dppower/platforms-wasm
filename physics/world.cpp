#include <emscripten/bind.h>
#include "world.h"
#include "tile_data.h"

//const float time_step = 0.02;
const int32 velocity_iterations = 4;
const int32 position_iterations = 2;

const b2Vec2 gravity(0.0f, -9.8f);

World::World()
	: world_(gravity), player_(), world_bounds_(), contact_listener_(&player_)
{
}


World::~World()
{
}

void World::tick(float time_step)
{
	player_.update(time_step);
	for (auto& platform : platforms_) {
		platform.update(time_step);
	}

 	world_.Step(time_step, velocity_iterations, position_iterations);

	player_.updateRenderData();
	for (auto& platform : platforms_) {		
		platform.updateRenderData();
	}
}

void World::init(float width, float height, int input_index, int data_index, 
	int platform_count, int tile_index, int tile_count, int tile_rows, int tile_columns
) {
	world_.SetContactListener(&contact_listener_);

	input_component_.init(input_index);

	world_bounds_.init(world_, width, height);

	RenderData* player_ptr = reinterpret_cast<RenderData*>(data_index);	
	player_.init(world_, player_ptr, &input_component_);

	// Platforms
	PlatformData* platform_ptr = reinterpret_cast<PlatformData*>(player_ptr + 1);

	for (int i = 0; i < platform_count; i++) {
		platforms_.emplace_back();		
	}

	for (int i = 0; i < platform_count; i++) {
		platforms_[i].init(world_, platform_ptr, i, &input_component_);
	}

	// Tiles
	TileData* tile_ptr = reinterpret_cast<TileData*>(tile_index);

	for (int i = 0; i < tile_count; i++) {
		tiles_.emplace_back();
	}

	// Tile Body
	b2BodyDef bodyDef;
	bodyDef.type = b2_staticBody;
	bodyDef.position.Set(0, 0);
	tile_body_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world_.CreateBody(&bodyDef),
		[this](b2Body*  body) { world_.DestroyBody(body); }
	);

	float tile_width = width / tile_columns;
	float tile_height = height / tile_rows;

	for (int i = 0; i < tile_count; i++) {
		tiles_[i].init(tile_body_.get(), tile_ptr + i, tile_width, tile_height);
	}
}

EMSCRIPTEN_BINDINGS(physics) {
	emscripten::class_<World>("World")
		.constructor()
		.function("init", &World::init)
		.function("tick", &World::tick);
}
