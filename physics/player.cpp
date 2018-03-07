#include "player.h"
#include <Box2D/Dynamics/b2Fixture.h>
#include <Box2D/Collision/Shapes/b2CircleShape.h>
#include <Box2D/Collision/Shapes/b2PolygonShape.h>
#include <Box2D/Dynamics/b2Body.h>
#include <Box2D/Common/b2Math.h>
#include <numeric>
#include <algorithm>

Player::Player() :
	is_colliding_below_(false), jump_sensor_tag_("jump"), upper_tag_("upper"), lower_tag_("lower")
{
}

Player::~Player()
{
}

b2Vec2 Player::get_positon()
{
	return body_->GetPosition();
}

bool Player::is_colliding_below()
{
	return is_colliding_below_;
}

void Player::handleContactBegin(b2Contact * contact)
{	
	void* data = contact->GetFixtureA()->GetUserData();
	std::string tag;
	if (data) {
		tag = *(static_cast<std::string*>(data));
		if (tag == jump_sensor_tag_) {
			jump_contacts_.push_back(contact);
		}
	}

	data = contact->GetFixtureB()->GetUserData();
	if (data) {
		tag = *(static_cast<std::string*>(data));
		if (tag == jump_sensor_tag_) {
			jump_contacts_.push_back(contact);
		}
	}
	
}

void Player::handleContactEnd(b2Contact * contact)
{
	void* data = contact->GetFixtureA()->GetUserData();
	std::string tag;
	if (data) {
		tag = *(static_cast<std::string*>(data));		
		if (tag == jump_sensor_tag_) {
			clearJumpContacts();
		}
	}

	data = contact->GetFixtureB()->GetUserData();
	if (data) {
		tag = *(static_cast<std::string*>(data));			
		if (tag == jump_sensor_tag_) {
			clearJumpContacts();
		}
	}	
}

void Player::disableJumpContact(b2Contact * contact)
{
	void* data = contact->GetFixtureA()->GetUserData();
	std::string tag;
	if (data) {
		tag = *(static_cast<std::string*>(data));
		if (tag == jump_sensor_tag_) {
			contact->SetEnabled(false);
		}
	}

	data = contact->GetFixtureB()->GetUserData();
	if (data) {
		tag = *(static_cast<std::string*>(data));
		if (tag == jump_sensor_tag_) {
			contact->SetEnabled(false);
		}
	}
}

void Player::clearJumpContacts() {
	auto it = std::remove_if(
		jump_contacts_.begin(), jump_contacts_.end(), 
		[](b2Contact* contact) { return !contact || !(contact->IsTouching()); }
	);
	jump_contacts_.erase(it, jump_contacts_.end());
}

void Player::updateCollidingBelow()
{
	// Check jump normals
	std::vector<b2Vec2> normals;

	std::transform(jump_contacts_.begin(), jump_contacts_.end(),
		std::back_inserter(normals), 
		[this](b2Contact* contact) {
			b2WorldManifold manifold;
			contact->GetWorldManifold(&manifold);		
			std::string& tag = *(static_cast<std::string*>(contact->GetFixtureA()->GetUserData()));
			if (tag == jump_sensor_tag_) {
				return -1 * manifold.normal;
			}
			else {
				return manifold.normal;
			}
		}
	);

	b2Vec2 normal = std::accumulate(
		normals.begin(), normals.end(), b2Vec2_zero, 
		[](const b2Vec2& a, const b2Vec2& b) {
			return a + b;
		}
	);
	normal.Normalize();

	b2Vec2 up(0.0f, 1.0f);
	float32 dp = b2Dot(normal, up);

	if (dp > 0.5) {
		is_colliding_below_ = true;
	}
	else {
		is_colliding_below_ = false;
	}
}

void Player::init(b2World& world, RenderData* data_ptr, InputComponent* input_component)
{
	render_data_ = data_ptr;
	input_component_ = input_component;

	float x = render_data_->x;
	float y = render_data_->y;
	float hw = render_data_->hw;
	float hh = render_data_->hh;

	// Body
	b2BodyDef bodyDef;
	bodyDef.type = b2_dynamicBody;
	bodyDef.position.Set(x, y);
	bodyDef.fixedRotation = true;
	body_ = std::unique_ptr<b2Body, std::function<void(b2Body*)>>(
		world.CreateBody(&bodyDef), 
		[&world](b2Body*  body) { world.DestroyBody(body); }
	);

	// Three fixtures, two circles and rectangle to form capsule
	b2FixtureDef fixtureDef;
	fixtureDef.density = 1.0f;

	b2CircleShape lower_circle;
	lower_circle.m_p.Set(0.0f, -hh);
	lower_circle.m_radius = hw;
	fixtureDef.shape = &lower_circle;
	fixtureDef.userData = static_cast<void*>(&lower_tag_);
	body_->CreateFixture(&fixtureDef);

	b2CircleShape upper_circle;
	upper_circle.m_p.Set(0.0f, hh);
	upper_circle.m_radius = hw;
	fixtureDef.shape = &upper_circle;
	fixtureDef.userData = static_cast<void*>(&upper_tag_);
	body_->CreateFixture(&fixtureDef);

	b2PolygonShape body_rect;
	body_rect.SetAsBox(hw - 0.05f, hh);
	fixtureDef.shape = &body_rect;
	fixtureDef.userData = nullptr;
	body_->CreateFixture(&fixtureDef);

	b2FixtureDef sensorDef;
	sensorDef.density = 1.0f;
	b2CircleShape jump_sensor;
	jump_sensor.m_p.Set(0.0f, -hh - 0.1f);
	jump_sensor.m_radius = hw;
	sensorDef.shape = &jump_sensor;
	//sensorDef.isSensor = true;
	sensorDef.userData = static_cast<void*>(&jump_sensor_tag_);
	body_->CreateFixture(&sensorDef);
}

void Player::jump()
{	
	updateCollidingBelow();
	if (is_colliding_below_) {
		float impulse = body_->GetMass() * 8;
		body_->ApplyLinearImpulseToCenter(b2Vec2(0, impulse), true);
	}
}

void Player::move()
{
	int direction = 0;
	if (input_component_->isKeyDown(InputActions::MoveLeft)) {
		direction -= 1;
	}
	if (input_component_->isKeyDown(InputActions::MoveRight)) {
		direction += 1;
	}
	b2Vec2 current_velocity = body_->GetLinearVelocity();
	float move_speed = b2Min(b2Max(current_velocity.x + direction * 0.2f,  -10.0f), 10.0f);
	move_speed *= 0.95f;
	float velocity_x = move_speed - current_velocity.x;
	float impulse = body_->GetMass() * velocity_x;
	body_->ApplyLinearImpulseToCenter(b2Vec2(impulse, 0), true);
}

void Player::update(float dt)
{
	move();
	if (input_component_->isKeyPressed(InputActions::Jump)) {
		jump();
	}
}

void Player::updateRenderData()
{
	b2Transform transform = body_->GetTransform();
	render_data_->x = transform.p.x;
	render_data_->y = transform.p.y;
}


