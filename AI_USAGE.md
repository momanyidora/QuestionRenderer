

## What this file is for
This file documents any AI assistance used during development and explains how the work was verified and how i understood it.



## Did you use AI?
 Yes


## Tools used

| Tool  |           | Provider |       |What I used it for |
| Claude |          |Anthropic|         |Discussing component behavior, validation logic, testing approaches, and debugging ideas|
                                     
|Claude| 	        |Anthropic|	        |Clarifying TypeScript types, React form handling, and test expectations|

>  
> Basic IDE autocomplete (bracket closing, common keywords) does not need to be declared.



## How AI was used

Check every box that applies.
Check every box that applies.


- [ ] Researching concepts or syntax
- [ ] Brainstorming approaches
- [ ] Debugging errors
- [ ] Discussing implementation approaches
- [ ] Explaining concepts or documentation


Describe any other use here:
```
AI was mainly used as a discussion and learning tool to clarify React, TypeScript, form validation, 
and testing concepts before implementation and verification.



## What AI influenced

List the specific files, functions, or sections where AI played a role.

| File or section |           | What AI contributed |                          | What I changed, verified, or rewrote |
|QuestionRenderer.tsx|        |Answered questions about validation             |Reviewed the implementation and verified it through testing|
                                behavior and React form handling|

|QuestionRenderer.test.tsx	| Suggested areas that could be tested |	       |Ran tests and checked that the expected behavior was covered|
|questionTypes.ts	        | Clarified TypeScript type concepts |	           |Reviewed the types and confirmed they matched the requirements|
                                                                                

AI was used for explanations, clarification, and discussion. The project implementation, testing, and final submission remain my responsibility.





## Verification

### Commands I ran
     npm test
     npm run lint 
     npm run build


### What I manually checked

All question types render correctly.
Required field validation works.
Minimum length validation works.
Select, radio, and checkbox inputs behave correctly.
Form submission only occurs when inputs are valid.
Checkbox answers are submitted as arrays.
Paste restrictions work as expected.
Error messages display correctly.


### Bugs I found and fixed

| Bug or issue |                               | How I found it |                       | How I fixed it |

|Validation errors not appearing consistently  |  Manual testing and automated tests|	| Updated touched-state handling and validation flow
|Test failures related to form behavior	       | Running the test suite	                |Corrected test expectations and component behavior
|Paste handling behavior required verification | Manual testing|	                    |Verified event handling and prevention logic





## Understanding check

**What does this project do and how does it work?**

This project renders different question types from a configuration object and collects user responses.
 It supports text inputs, textareas, select menus, radio buttons, and checkboxes. 
 Validation is performed based on question settings such as required fields, minimum length, 
 maximum length, and patterns. The form only submits when all validation rules pass.


**Which part are you most confident about?**
The form validation behavior and the test coverage for the supported question types.


**Which part are you still unsure about?**
I would need to review additional requirements if new question types or more advanced validation rules were introduced in the future.




## Declaration

By committing this file, I confirm that this project is my responsibility and that I can defend it.