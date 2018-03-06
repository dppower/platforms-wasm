#pragma once
#include <Box2D/Dynamics/b2World.h>
#include <Box2D/Dynamics/b2Body.h>
#include<Box2D/Dynamics/Joints/b2Joint.h>
#include <functional>
#include <string>
#include "render_data.h"
#include "input_component.h"

class Platform
{
public:
	Platform();
	~Platform();
	Platform(Platform&& platform);
	void init(b2World& world, PlatformData* data_ptr, int index, InputComponent* input_component);
	void update(float dt);
	void updateRenderData();

private:
	PlatformData* render_data_;
	InputComponent* input_component_;
	int platform_index_;
	// Bodies
	std::unique_ptr<b2Body, std::function<void(b2Body*)>> platform_body_;
	std::unique_ptr<b2Body, std::function<void(b2Body*)>> pivot_body_;
	std::unique_ptr<b2Body, std::function<void(b2Body*)>> start_point_;
	std::unique_ptr<b2Body, std::function<void(b2Body*)>> end_point_;
	// Joints
	std::unique_ptr<b2Joint, std::function<void(b2Joint*)>> prismatic_joint_;
	std::unique_ptr<b2Joint, std::function<void(b2Joint*)>> revolute_joint_;
};

