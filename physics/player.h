#pragma once
#include <Box2d/Dynamics/b2World.h>
#include <Box2d/Dynamics/b2Body.h>

class Player
{
public:
	Player();
	~Player();

	b2Vec2 get_positon();
	bool is_colling_below();
	void init(b2World& world, float32 x, float32 y);

private:
	std::unique_ptr<b2Body> body;
	bool is_colliding_below_;
};

