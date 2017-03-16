recstatus_choices = [('0', 'delete'), ('1', 'entry'), ('2', 'approve')]
recstatus_choices_all = recstatus_choices[:]
recstatus_choices_all.append(('3', 'all'))
recstatus_choices_toggleable = recstatus_choices[:]
recstatus_choices_toggleable.pop(0)
recstatus_choices_title_case = [(choice[0], choice[1].title()) for choice in recstatus_choices]
recstatus_choices_dict = {choice[0]: choice[1] for choice in recstatus_choices}
recstatus_choices_all_title_case = [(choice[0], choice[1].title()) for choice in recstatus_choices_all]
yesno_choices = [('False', 'No'), ('True', 'Yes')]
