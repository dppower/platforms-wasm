#pragma once
#include <Box2D/Dynamics/b2World.h>
#include <Box2D/Dynamics/b2Body.h>
#include <functional>
#include "render_data.h"

class Player
{
public:
	Player();
	~Player();

	b2Vec2 get_positon();
	bool is_colling_below();
	void init(b2World& world, RenderData* data_ptr);
	void jump();
	void move(int direction);
	void updateRenderData();

private:
	RenderData* render_data_;
	std::unique_ptr<b2Body, std::function<void(b2Body*)>> body_;
	bool is_colliding_below_;
};

