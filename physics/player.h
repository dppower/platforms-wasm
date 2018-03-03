#pragma once
#include <Box2D/Dynamics/b2World.h>
#include <Box2D/Dynamics/b2Body.h>
#include <Box2D/Dynamics/Contacts/b2Contact.h>
#include <Box2D/Common/b2Math.h>
#include <vector>
#include <functional>
#include <string>
#include "render_data.h"

class Player
{
public:
	Player();
	~Player();

	b2Vec2 get_positon();
	bool is_colliding_below();
	void handleContactBegin(b2Contact* contact);
	void handleContactEnd(b2Contact* contact);
	void disableJumpContact(b2Contact* contact);
	void init(b2World& world, RenderData* data_ptr);
	void jump();
	void move(int direction);
	void update(float dt);
	void updateRenderData();

private:
	void clearJumpContacts();
	void updateCollidingBelow();
	std::vector<b2Contact*> jump_contacts_;
	std::string jump_sensor_tag_;
	std::string upper_tag_;
	std::string lower_tag_;
	RenderData* render_data_;
	std::unique_ptr<b2Body, std::function<void(b2Body*)>> body_;
	bool is_colliding_below_;
};

