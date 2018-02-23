#include "world.h"
#include <emscripten/bind.h>

const float time_step = 0.02;
const int32 velocity_iterations = 6;
const int32 position_iterations = 2;

const b2Vec2 gravity(0.0f, -9.8f);

World::World()
	: world_(gravity), player_(), world_bounds_()
{
}


World::~World()
{
}

void World::tick(float time_step, bool jump, int move)
{
	if (jump) {
		player_.jump();
	}
	this->player_.move(move);
	//accumulated_time_ += time;
	//while (accumulated_time_ >= time_step) {
	world_.Step(time_step, velocity_iterations, position_iterations);
		//accumulated_time_ -= time_step;
	//}
	//return accumulated_time_;
	player_.updateRenderData();
	for (auto& platform : platforms_) {
		platform.updateRenderData();
	}
}

void World::init(float width, float height, int data_index, int platform_count)
{
	RenderData* data_ptr = reinterpret_cast<RenderData*>(data_index);
	world_bounds_.init(world_, width, height);
	player_.init(world_, data_ptr);

	for (int i = 0; i < platform_count; i++) {
		platforms_.emplace_back();
		platforms_[i].init(world_, data_ptr, i + 1);
	}
}

EMSCRIPTEN_BINDINGS(physics) {
	emscripten::class_<World>("World")
		.constructor()
		.function("init", &World::init)
		.function("tick", &World::tick);
}
