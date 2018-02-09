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

float World::tick(float time)
{
	accumulated_time_ += time;
	while (accumulated_time_ >= time_step) {
		world_.Step(time_step, velocity_iterations, position_iterations);
		accumulated_time_ -= time_step;
	}
	return accumulated_time_;
}

void World::init(float player_x, float player_y)
{
	world_bounds_.init(world_);
	player_.init(world_, player_x, player_y);
}

EMSCRIPTEN_BINDINGS(physics) {
	emscripten::class_<World>("World")
		.constructor()
		.function("init", &World::init)
		.function("tick", &World::tick);
}
