#include "world.h"
#include <emscripten/bind.h>

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

void World::init(float width, float height, int input_index, int data_index, int platform_count)
{
	world_.SetContactListener(&contact_listener_);

	input_component_.init(input_index);

	RenderData* data_ptr = reinterpret_cast<RenderData*>(data_index);
	PlatformData* platform_ptr = reinterpret_cast<PlatformData*>(data_ptr + 1);

	world_bounds_.init(world_, width, height);
	player_.init(world_, data_ptr, &input_component_);

	for (int i = 0; i < platform_count; i++) {
		platforms_.emplace_back();		
	}

	for (int i = 0; i < platform_count; i++) {
		platforms_[i].init(world_, platform_ptr, i, &input_component_);
	}
}

EMSCRIPTEN_BINDINGS(physics) {
	emscripten::class_<World>("World")
		.constructor()
		.function("init", &World::init)
		.function("tick", &World::tick);
}
