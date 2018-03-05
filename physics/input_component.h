#pragma once
#include <Box2D/Common/b2Math.h>

enum InputActions {
	MoveLeft,
	MoveRight,
	Jump
};

typedef struct {
	int move_left;
	int move_right;
	int jump;
	int left_button;
	int right_button;
	float position_x;
	float position_y;
} InputState;

class InputComponent
{
public:
	InputComponent() {}
	~InputComponent() {}

	void init(int index) {
		previous_inputs_ = reinterpret_cast<InputState*>(index);
		current_inputs_ = previous_inputs_ + 1;
	}

	float dx() {
		return current_inputs_->position_x - previous_inputs_->position_x;
	}

	float dy() {
		return current_inputs_->position_y - previous_inputs_->position_y;
	}

	float x() {
		return current_inputs_->position_x;
	}

	float y() {
		return current_inputs_->position_y;
	}

	b2Vec2 position() {
		return b2Vec2(current_inputs_->position_x, current_inputs_->position_y);
	}

	bool isKeyDown(InputActions action) {
		switch (action) {
		case InputActions::MoveLeft:
			return !!current_inputs_->move_left;
		case InputActions::MoveRight:
			return !!current_inputs_->move_right;
		case InputActions::Jump:
			return !!current_inputs_->jump;
		default:
			return false;
		}
	}

	bool wasKeyDown(InputActions action) {
		switch (action) {
		case InputActions::MoveLeft:
			return !!previous_inputs_->move_left;
		case InputActions::MoveRight:
			return !!previous_inputs_->move_right;
		case InputActions::Jump:
			return !!previous_inputs_->jump;
		default:
			return false;
		}
	}

	bool isKeyPressed(InputActions action) {
		return isKeyDown(action) == true && wasKeyDown(action) == false;
	}

	bool wasKeyReleased(InputActions action) {
		return isKeyDown(action) == false && wasKeyDown(action) == true;
	}

	bool isButtonDown(const std::string& button) {
		if (button == "left") {
			return !!current_inputs_->left_button;
		}
		else if (button == "right") {
			return !!current_inputs_->right_button;
		}
		return false;
	}

	bool wasButtonDown(const std::string&  button) {
		if (button == "left") {
			return !!previous_inputs_->left_button;
		}
		else if (button == "right") {
			return !!previous_inputs_->right_button;
		}
		return false;
	}

	bool isButtonPressed(const std::string&  button) {
		return isButtonDown(button) == true && wasButtonDown(button) == false;
	}

	bool wasButtonReleased(const std::string&  button) {
		return isButtonDown(button) == false && wasButtonDown(button) == true;
	}

private:
	InputState* previous_inputs_;
	InputState* current_inputs_;
};